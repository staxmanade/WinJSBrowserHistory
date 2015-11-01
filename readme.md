
I originally published this as a [prototype in a blog post](http://staxmanade.com/2015/10/integrate-winjs-navigation-with-the-browser-s-history/) but got tired of iterating on it in a blog post so threw it up in this github repo for proper source tracking :)

The `WinJS.Navigation` is designed not to depend on the browser history but this makes it difficult to deal with when you want them to be in sync.

There is one example of how to use this in the `examples` folder. It uses JSPM/SystemJS to load the component.
