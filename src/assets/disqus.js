//DUMBLOG INFO:
//PASTE HERE THE CODE BETWEEN THE <SCRIPT> TAGS YOU CAN FIND IN THE INSTALLATION PAGE OF YOUR DISQUS ACCOUNT.
//EXAMPLE: https://YOUR_USERNAME.disqus.com/admin/settings/universalcode/
//CODE BELLOW IS EXAMPLE ONLY. DELETE AND PASTE YOUR OWN.

/**
*  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
*  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables*/
/*
var disqus_config = function () {
this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};
*/
(function() { // DON'T EDIT BELOW THIS LINE
var d = document, s = d.createElement('script');
s.src = 'https://YOUR_USERNAME.disqus.com/embed.js';
s.setAttribute('data-timestamp', +new Date());
(d.head || d.body).appendChild(s);
})();