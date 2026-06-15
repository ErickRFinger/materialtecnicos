import urllib.request, re, json

req = urllib.request.Request('https://drive.google.com/drive/folders/1xOX1e0IQKu_C5EEWF-2UzShTGpoxvVuc?usp=sharing', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
matches = re.findall(r'\["([a-zA-Z0-9_-]{28,})","([^"]+\.(?:mp4|png|jpeg|jpg|pdf))"', html)
print(json.dumps(list(set(matches))))
