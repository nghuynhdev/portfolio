---
title: "PlayCanvas: Build 3D Games in the Browser With Nothing to Install"
seoTitle: "What Is PlayCanvas? 3D Games in the Browser"
slug: playcanvas-3d-games-in-the-browser
description: "PlayCanvas is an open-source 3D engine with a browser-based editor: what it includes, how big it really is, and when to pick it over Three.js."
keywords: "PlayCanvas, what is PlayCanvas, 3D games on the web, WebGL, WebGPU, Gaussian Splatting, SuperSplat, Three.js vs PlayCanvas"
tags: "PlayCanvas, WebGL, WebGPU, Game Dev"
date: 2026-02-27
updated: 2026-11-13
cover: /images/blog/posts/02-playcanvas-lam-game-3d-tren-web-v2.webp
---

# PlayCanvas: Build 3D Games in the Browser With Nothing to Install

PlayCanvas is a 3D engine written for the web, and it comes with an editor you open from a link. The reason it deserves a look is fairly specific.

With Three.js, everything lives in code. To move a light to the left you change a number, save, wait for the reload, look, and change it again. That is bearable for a small scene. It is not for a game with dozens of scenes and an artist who doesn't write code. Unity solves this with an editor, but Unity's web builds are heavy, and web players don't wait.

PlayCanvas goes a different way: the engine is written for the browser, and the editor runs in the browser too.

## PlayCanvas is two things

People use one name for both, but they are separate.

The **engine** is a JavaScript library for drawing 3D. You install it with `npm install playcanvas`, it is MIT licensed, and the source is on [GitHub](https://github.com/playcanvas/engine). Besides rendering, it ships with physics, animation, audio, input handling and WebXR for headsets. You can use the engine without ever touching the editor.

The **Editor** is a scene-building tool that runs entirely in the browser. Open a link and you get a hierarchy on the left, a 3D viewport in the middle and an inspector on the right. Anyone who has opened Unity will know their way around. The difference is that you download and install nothing, and projects save to the cloud on their own.

## Several people in one scene

A whole team can open the same scene and edit it at the same time, the way people work together in a shared design file.

According to the [official docs](https://developer.playcanvas.com/user-manual/editor/), you can see where the others are looking in the scene, and there is chat built in. An artist can adjust lighting while a developer writes scripts, and nobody waits for anyone to send a file.

The rest of the toolset is enough for a serious project:

- Version control made for 3D projects: checkpoints to roll back to, branches for trying features, and merges with a visual conflict resolver.
- A code editor in the browser with autocomplete and error checking. If you prefer VS Code, there is an extension for working locally.
- A Launch button that opens the current build in a new tab. Send that link to a phone and you are testing on a real device.
- Publishing to the web (PlayCanvas hosting or your own), iOS and Android apps, desktop builds, and playable ads.

## How big the engine is

You will often see "a runtime of only about 200 KB" quoted online. I downloaded the build and measured it, and that is not the case.

For version 2.24.1 on npm, `playcanvas.min.js` is about 2.9 MB. Gzipped, which is what actually travels over the network, it is about 750 KB. That is the full build with every feature. The engine supports tree-shaking, so a real project bundles only what it uses and comes in below that number.

For a sense of scale, I measured Three.js the same way: its two main build files add up to about 195 KB gzipped. Three.js is much lighter, but it only handles rendering. Physics, audio and asset management are libraries you add yourself.

For a game, 750 KB is not heavy. One music track or a few textures are already that size, and it is still far smaller than a Unity WebGL build. Just keep the right number in mind: a few hundred KB up to a bit under 1 MB for the engine, not 200 KB.

## WebGL2 and WebGPU

The engine runs on both. Where the browser has WebGPU it uses WebGPU, and otherwise it falls back to WebGL2, so you don't write two versions. PlayCanvas was one of the first engines to ship WebGPU for production use, compute shaders included.

On performance, don't trust an "always 60 fps on mobile" promise from any engine. Frame rate is decided by your scene: how many triangles, how many lights, how heavy the textures are. The engine only decides where you start from, and PlayCanvas was designed for low-end devices from the beginning.

## Gaussian Splatting and SuperSplat

PlayCanvas invested in this area early.

Gaussian Splatting rebuilds a real place from photos or video. Instead of a triangle mesh, the scene is made of millions of soft, overlapping blobs of color. The result looks very close to a photograph, especially for things that are hard to model with triangles, such as foliage, hair or glass.

The engine loads and renders splats out of the box, with no plugin. Alongside it is [SuperSplat](https://github.com/playcanvas/supersplat), a free and also open-source tool for trimming, cleaning up and optimizing splats in the browser before you publish them. Its recent 3.0 release was rebuilt on WebGPU.

If you work on real estate, museums or showrooms and want visitors to walk around a space you scanned with a phone, that alone is a reason to try PlayCanvas.

## What people use it for

The list of users in the engine's README includes BMW, Disney, Samsung, Snap, King, Zynga and Miniclip. Looking at [the projects they showcase](https://playcanvas.com/industries/games), the work falls into three groups:

- **Games that run inside existing platforms:** Snapchat, Facebook Instant Games, YouTube Playables, and web game portals such as CrazyGames and Poki. A player taps and has to be playing right away, so fast loading is a hard requirement.
- **Playable ads and product configurators:** rotate a car, change the paint, swap the wheels, all on the web.
- **Scanned real-world spaces:** thanks to the Gaussian Splatting support above.

## Trying a spinning cube

This is shortened from the example in the README. It uses only the engine, no Editor:

```js
import { Application, Color, Entity, FILLMODE_FILL_WINDOW, RESOLUTION_AUTO } from 'playcanvas'

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)

const app = new Application(canvas)
app.setCanvasFillMode(FILLMODE_FILL_WINDOW)
app.setCanvasResolution(RESOLUTION_AUTO)

const box = new Entity('cube')
box.addComponent('render', { type: 'box' })
app.root.addChild(box)

const camera = new Entity('camera')
camera.addComponent('camera', { clearColor: new Color(0.1, 0.2, 0.3) })
camera.setPosition(0, 0, 3)
app.root.addChild(camera)

const light = new Entity('light')
light.addComponent('light')
light.setEulerAngles(45, 0, 0)
app.root.addChild(light)

app.on('update', (dt) => box.rotate(10 * dt, 20 * dt, 30 * dt))
app.start()
```

Everything in the scene is an `Entity`, and you attach components to make it do things. The box has a `render` component, the camera a `camera` component, the light a `light` component. The model is the same as Unity's and holds up well as a scene grows. With Three.js you wire up the scene, camera and renderer yourself and write your own render loop.

## PlayCanvas or Three.js

These two are not really rivals. They suit different kinds of work.

Pick **PlayCanvas** when you are building a game or a 3D experience with many scenes, and some people on the team don't write code. The Editor lets them adjust scenes on their own, and you stop being the go-between for every small change.

Pick **Three.js** when you only need a little 3D inside an existing page: a rotatable product model, a background effect, a 3D chart. It is lighter, and if you use React, React Three Fiber lets you write a 3D scene the way you write components. The moving particles behind [the homepage](/) are built with exactly that.

## Cost

The engine is MIT, free to use in commercial products too.

The Editor is a service. The free plan gives you unlimited public projects, 1 GB of storage and hosting. "Public" is the word to notice: anyone can view your project. Private projects need a paid plan.

A sensible way to try it: open the Editor on the free plan and build one small scene to see whether the workflow suits your team. If you only need the engine, install it from npm and use it like any other JavaScript library.
