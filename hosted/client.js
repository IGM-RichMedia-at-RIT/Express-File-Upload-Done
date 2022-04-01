/* This is our client side javascript file, loaded in by
   upload.handlebars. When the page loads (window.onload),
   our init function will grab the form and hook up the
   submit event listener.

   Whenever the submit event is fired, we will prevent the
   default form action and then will use fetch to send the
   file data. To do this, we need to create a FormData object
   because file upload relies on MultiPart-FormData.

   Once we send the request, we will simply display the
   json response on screen as text. This is simply for
   convenience and should not be done in a production app.
*/

const uploadFile = async (e) => {
    e.preventDefault();

    const response = await fetch('/upload',{
        method: 'POST',
        body: new FormData(e.target),
    });

    const text = await response.text();
    document.getElementById('messages').innerText = text;

    return false;
};

const init = () => {
    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', uploadFile);
};

window.onload = init;
