import http.server
import socketserver
from urllib.parse import urlparse, parse_qs
import somfy

PORT = 8080


class SomfyRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_url = urlparse(self.path)
        query = parse_qs(parsed_url.query)
        print(query)
        try:
            somfy.send_somfy_cmd(query['room'][0], query['cmd'][0])
        except KeyError:
            pass
        super().do_GET()


with socketserver.TCPServer(("", PORT), SomfyRequestHandler) as httpd:
    print("serving at port", PORT)
    httpd.serve_forever()

