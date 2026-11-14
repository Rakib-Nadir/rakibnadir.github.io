"""Local preview server with clean URLs (/about serves about.html), like the live site."""
import http.server, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ROOT = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def do_GET(self):
        path, _, query = self.path.partition('?')
        q = ('?' + query) if query else ''
        # Old .html links -> clean URL
        if path.endswith('.html') and path != '/404.html':
            clean = path[:-5]
            if clean.endswith('/index'):
                clean = clean[:-5] or '/'
            self.send_response(301)
            self.send_header('Location', clean + q)
            self.end_headers()
            return
        # Clean URL -> matching .html file
        local = os.path.join(ROOT, path.lstrip('/'))
        if path != '/' and not os.path.splitext(path)[1] and os.path.isfile(local + '.html'):
            self.path = path + '.html' + q
        return super().do_GET()

    def send_error(self, code, message=None, explain=None):
        page = os.path.join(ROOT, '404.html')
        if code == 404 and os.path.isfile(page):
            body = open(page, 'rb').read()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            super().send_error(code, message, explain)

if __name__ == '__main__':
    print(f'Serving on http://localhost:{PORT}/  (Ctrl+C to stop)')
    http.server.ThreadingHTTPServer(('', PORT), Handler).serve_forever()
