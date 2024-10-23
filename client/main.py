import websocket
import threading
import json
import time
import requests
import queue

SERVER_DOMAIN = 'https://websocket-server-c5a2gwgcgpdtgpab.eastus2-01.azurewebsites.net'

invoices_queue = queue.Queue()
processing_lock = threading.Lock()
stop_event = threading.Event()
ws = None


def notify_processed_invoice(invoice_id: int):
    try:
        request = requests.post(f'{SERVER_DOMAIN}/api/notify-invoice', json={'invoiceID': invoice_id})
        print(f'Response status: {request.status_code}')
        print(f'Response content: {request.json()}')
    except Exception as traceback:
        print(f'Error to notify invoice with the id: {invoice_id}. Error: {traceback}')


def processing_invoices():
    while not stop_event.is_set():
        try:
            invoice = invoices_queue.get(timeout=1)

            if invoice is None:
                print('> No more invoices to process')
                break

            with processing_lock:
                try:
                    print(f'> Processing invoice: {invoice}')
                    time.sleep(5)
                    print(f'> Invoice processed: {invoice}')

                    invoice_id = invoice.get('invoiceID', None)

                    if invoice_id:
                        notify_processed_invoice(invoice_id)
                except Exception as traceback:
                    print(f'> Error processing invoice: {traceback}')
                finally:
                    invoices_queue.task_done()
                    print('> --------------------------------------------')
        except queue.Empty:
            continue

    print('> Processing invoices stopped')


def on_message(ws, message):
    try:
        data = json.loads(message)
        if isinstance(data, dict):
            invoices_queue.put(data)
    except Exception as traceback:
        print(f'> Error processing data: {traceback}')


def run_websocket():
    # Reference to ws global variable
    global ws
    try:
        # First we need to get the websocket URL
        response = requests.get(f'{SERVER_DOMAIN}/api/negotiate')
        ws_url = response.json().get('url', None)
        print(f'> Websocket URL: {ws_url}')

        if ws_url is None:
            print('> Error getting websocket URL')
            return

        websocket.enableTrace(True)
        ws = websocket.WebSocketApp(ws_url, on_message=on_message)
        print('> Websocket running...')

        ws.run_forever()

        print('> Websocket stopped.')
    except Exception as traceback:
        print(f'> Error running websocket: {traceback}')


if __name__ == "__main__":
    websocket_thread = threading.Thread(target=run_websocket)
    websocket_thread.start()

    try:
        processing_invoices()
    except KeyboardInterrupt:
        print('> Stopping the application...')
        stop_event.set()
    except Exception as traceback:
        print(f'> Error: {traceback}')
        stop_event.set()
    finally:
        invoices_queue.put(None)

        if ws is not None:
            ws.close()

        if websocket_thread.is_alive():
            websocket_thread.join()

    print('> Application stopped.')
