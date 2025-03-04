import hashlib

def generate_short_url(original_url):
    # Using MD5 hash and truncating it to 6 characters
    hash_object = hashlib.md5(original_url.encode())
    return hash_object.hexdigest()[:6]
