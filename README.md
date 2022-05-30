### Markdown Fork (ngx-mkdumblog)

The 'ngx-mkdumblog', is a version powered by a Markdown editor and renderer, that allows you to write your posts in Markdown. It's currently available [in this repo](https://github.com/pedroCX486/ngx-mkdumblog).

**Note:** ngx-mkdumblog and ngx-dumblog posts aren't compatible with each other!

------------------

# ngx-Dumblog

The new version of [Dumblog](https://github.com/pedroCX486/dumblog), now fully written in Angular! I always thought that the idea of having a local editor was neat, but hard to keep developing native versions to all major platforms. So now you have an full-fledged editor online (it can't save the files to your repo, you have to commit the files it'll provide), customization on the settings.json and a few things more.

## Customizations

On the settings.json file you'll find options to customize your blog title, avatar, bio, social networks (leave the fields empty, don't delete them if you don't want them showing up!), ability to enable Disqus (check the Disqus.js file for more instructions) and ability to select how many posts will be shown on the home page.

## Pre-built version

You can download the pre-built versions in the [releases page](https://github.com/pedroCX486/ngx-dumblog/releases/latest). Just unzip, customize your settings.json, hello-world.json and archives.json as you'd like and commit the files to your github.io repo!

## Creating and editing posts

You can go to YOUR_USERNAME.github.io/?page=editor to see the online editor. From there you can create and edit posts. To have those posts reflect on Github, you need to place and commit the files it generates in the assets/posts folder of your install.

## Running locally

First run `npm install` then run `npm start` and it should open automatically on `http://localhost:4200/`.

## Build

Run `npm run build` to build it. You can also run `custom-build.bat` to build it and then have the index.html title changed after build. But **first** change the variable BLOGNAME inside the .bat file! I intend to add a tool in the future capable of reading the name from the settings.json and then updating the index.html after the build, instead of keeping this .bat file.

## Contributing

Just do a pull request.  :-)

## Why?

Because I always thought Jekyll to be too convoluted and I wanted something dumb and simple. The code isn't an example of awesomeness but it does the job and pretty well at that. Way better than the bullshit that was the old version in JQuery and C#.
