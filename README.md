# Nic's Node HTTPD

This is a really simply little httpd with few depends... but some
tricks up it's sleeves.

It will show index pages of bare directories.

Inside an index, if you focus on a link to a file that is an image,
then the image will be displayed on the right. The same works for
video files.

The server also supports range requests so skipping in the timeline of
a video will work.

If you click on a markdown file, it will be turned into HTML and
somewhat styled.

There are lots of these little things that I wish a webserver would do
so that I could start it up and view a page quickly.

So this is a webserver to do them.


## How to?

Start a webserver in a directory:

```
$ cd a-directory
$ httpd
listening on 56115
```

the port will vary of course.

Or you could start a webserver with a specific port:

```
$ cd a-directory
$ httpd 8081
listening on 8080
```
