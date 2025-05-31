from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import URL
from .utils import generate_short_url

# View for shortening URL
def shorten_url(request):
    if request.method == 'POST':
        original_url = request.POST.get('url')
        if original_url:
            # Check if URL already exists
            existing_url = URL.objects.filter(original_url=original_url).first()
            if existing_url:
                short_url = existing_url.short_url
            else:
                # Generate new short URL and save it
                short_url = generate_short_url(original_url)
                URL.objects.create(original_url=original_url, short_url=short_url)
            return HttpResponse(f"Short URL: <a href='/{short_url}'>/{short_url}</a>")
    return render(request, 'shortener/index.html')

# View to redirect to original URL
def redirect_to_url(request, short_url):
    try:
        url = URL.objects.get(short_url=short_url)
        return redirect(url.original_url)
    except URL.DoesNotExist:
        return HttpResponse("Short URL not found!", status=404)
