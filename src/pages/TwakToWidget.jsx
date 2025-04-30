import { useEffect } from "react";

const TawkToWidget = () => {
    useEffect(() => {
      // Add Tawk.to script dynamically with your new property ID and widget ID
      var Tawk_API = Tawk_API || {};
      var Tawk_LoadStart = new Date();
      (function () {
        var s1 = document.createElement("script");
        var s0 = document.getElementsByTagName("script")[0];
        s1.async = true;
        // Your new widget URL
        s1.src = 'https://embed.tawk.to/67fdf928e96fd6190c29e0c1/1ios1aibh';
        s1.charset = 'UTF-8';
        s1.setAttribute('crossorigin', '*');
        s0.parentNode.insertBefore(s1, s0);
      })();
  
      // You can add these in your TawkToWidget.jsx
      Tawk_API.onLoad = function(){
        Tawk_API.setAttributes({
            'name': 'Venue Finder Support',
            'email': 'support@venuefinder.com',
            'hash': 'unique-hash-per-user'
        }, function(error){});
      };
  
      return () => {
        // Clean up script when component is unmounted
        const existingScript = document.querySelector(
          'script[src="https://embed.tawk.to/67fdf928e96fd6190c29e0c1/1ios1aibh"]'
        );
        if (existingScript) {
          existingScript.remove();
        }
      };
    }, []);
  
    return null; // This component renders nothing visible
};
  
export default TawkToWidget;
