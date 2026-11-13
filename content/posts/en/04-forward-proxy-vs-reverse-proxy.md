---
title: "Forward Proxy vs Reverse Proxy: The Difference Is Who It Works For"
seoTitle: "Forward Proxy vs Reverse Proxy Explained"
slug: forward-proxy-vs-reverse-proxy
description: "A forward proxy sits on the client's side, a reverse proxy on the server's side. This post covers what each does, how HTTPS passes through a proxy, and the req.ip bug Node.js apps hit behind Nginx."
keywords: "forward proxy, reverse proxy, what is a proxy, Nginx reverse proxy, X-Forwarded-For, Express trust proxy, load balancer, VPN vs proxy"
tags: "Networking, Nginx, Backend, Node.js"
date: 2026-11-13
---

# Forward Proxy vs Reverse Proxy: The Difference Is Who It Works For

The usual answer to this question is: "A forward proxy sits in front of the client, a reverse proxy sits in front of the server." That is not wrong, but it explains nothing. Draw it on paper and both are a box between a client and a server.

I find it easier to remember with a different question: **who set the proxy up, and who does it work for?**

## A proxy is just a middleman

A proxy is a machine that takes a request from one side and sends it to the other on that side's behalf. The receiver sees only the proxy, not the real sender.

Technically, forward and reverse proxies do the same job: accept a request, pass it on, return the response. Some software can play both roles. What differs is where it stands in the relationship: with the users, or with the service.

## Forward proxy: the client's representative

A forward proxy is set up on the client side, usually by a company or a school. Machines on the internal network don't reach the internet directly. They go through the proxy.

From the website's point of view, the visitor is the proxy. It sees the proxy's IP address, not your machine's. So a forward proxy **hides the client**.

People use it to:

- Block certain sites, such as social media during work hours.
- Log who accessed what, for security audits.
- Cache frequently downloaded content and save bandwidth.
- Send all outbound traffic from a few fixed IP addresses, so partners only need to allow those.

One thing to remember: the client **knows** it is using a proxy. The browser or the operating system has to be configured to send requests through it.

### How HTTPS passes through a forward proxy

This part is often misunderstood. If everything is encrypted, how does the proxy forward it?

The browser sends the proxy a special request using the `CONNECT` method:

```http
CONNECT example.com:443 HTTP/1.1
Host: example.com:443
```

The proxy opens a TCP connection to `example.com` and then passes data back and forth without reading it. In [MDN's words](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/CONNECT), it forwards data "blindly" until the tunnel is closed. The TLS handshake happens directly between the browser and the website, inside that tunnel.

The result is that the proxy knows **which site** you visit but cannot read the **content**. It can block by domain. It cannot read your password.

There is one exception: a company that installs its own root certificate on employee machines. The proxy can then decrypt the traffic, inspect it and encrypt it again. Company-issued laptops are often set up this way, so don't assume HTTPS on a work machine is private.

### Is a VPN a forward proxy?

Similar in outcome, different in mechanism.

Both make the website see a different IP address instead of yours. But a forward proxy works at the application layer, usually only for HTTP and HTTPS, and each application has to be configured to use it. A VPN works at the network layer: it builds an encrypted tunnel and sends all of the machine's traffic through it, and applications don't need to know.

Likewise, when campus Wi-Fi blocks YouTube, it is not necessarily a forward proxy. Many networks block with DNS or a firewall. The mechanism differs, but the user sees the same result.

## Reverse proxy: the server's gatekeeper

A reverse proxy is set up on the service side. Users call a single address, for example `api.example.com`. Behind that address is Nginx, a cloud provider's load balancer, or Cloudflare. It takes the request and decides which server handles it.

Users don't know how many servers are behind it, what their addresses are, or what software they run. So a reverse proxy **hides the servers**.

And unlike a forward proxy, the client **does not know** a proxy is there. To the client, the reverse proxy is the server.

Because every request has to pass through it, it is the most convenient place for shared concerns:

- **Load balancing:** spread requests across servers and skip the ones that are down.
- **TLS termination:** decrypt HTTPS at the proxy and use plain HTTP inside the private network. Certificates are managed in one place.
- **Caching:** return static content without asking the servers behind it.
- **Rate limiting:** stop an address that calls too often before it reaches the application.
- **Attack filtering:** block malicious requests and absorb DDoS traffic.
- **Path-based routing:** `/api` goes to one service, `/images` to another.

When you open a large website, what you reach is almost certainly a reverse proxy, not an application server. This blog is no different: it runs on Vercel, and your request passes through their edge network before it gets to the page.

A minimal Nginx configuration looks like this:

```nginx
upstream api {
  server 10.0.0.11:3000;
  server 10.0.0.12:3000;
}

server {
  listen 443 ssl;
  server_name api.example.com;

  location / {
    proxy_pass http://api;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

The three `proxy_set_header` lines lead to the most practical issue in this post.

## A common bug: a Node.js app behind a reverse proxy sees the wrong IP

When an app sits behind a reverse proxy, the TCP connection to the app comes from the proxy, not from the user. The consequences:

- `req.ip` returns the proxy's internal address, something like `10.0.0.5`, for every request.
- IP-based rate limiting treats all users as one and blocks everyone at once.
- `req.protocol` reports `http` even though the user came in over HTTPS, which breaks redirects and `secure` cookies.

The proxy knows the user's real address, and it tells the app through headers: `X-Forwarded-For` carries the IP, `X-Forwarded-Proto` the original protocol. The app only has to read them. In Express you turn that on with the `trust proxy` setting:

```ts
app.set('trust proxy', 1)
```

NestJS on top of Express looks like this:

```ts
const app = await NestFactory.create<NestExpressApplication>(AppModule)
app.set('trust proxy', 1)
```

The `1` means: trust exactly one proxy directly in front of the app. With two layers, for example Cloudflare and then Nginx, it is `2`.

Don't write `app.set('trust proxy', true)` as a shortcut. Headers are something the client can send too. Nginx's `$proxy_add_x_forwarded_for` variable **appends** the real IP after whatever the client sent. It does not overwrite it. If the app trusts everything and takes the left-most value, an attacker only has to add an `X-Forwarded-For: 1.2.3.4` header to change their IP as the app sees it, and get around rate limiting. The [Express docs](https://expressjs.com/en/guide/behind-proxies.html) warn about exactly this: with `true`, the last trusted proxy must remove or overwrite those headers, or the client can supply any value.

Declare the right number of proxy layers and Express counts from the right, takes the address your own proxy wrote, and ignores whatever the client made up.

## Summary

| | Forward proxy | Reverse proxy |
|---|---|---|
| Who sets it up | The client side (company, school) | The service side |
| Who it hides | The client | The servers |
| What the other side sees | The website sees the proxy's IP | Users see a single address |
| Does the client know | Yes, it must be configured | No |
| Used for | Blocking sites, logging, caching | Load balancing, TLS, caching, rate limiting, attack filtering |
| Examples | Squid, a corporate proxy | Nginx, HAProxy, Cloudflare, cloud load balancers |

If you remember one thing, make it this: the two are the same technique, and they differ in whose side they are on. A forward proxy serves the people going out. A reverse proxy serves the service letting people in.

And if you write backends, the part worth taking away is the `trust proxy` section above. It is the kind of bug that never shows up on a local machine and only appears in production. A reverse proxy is also where health checks for the servers behind it usually live, which I covered in [health checks are more than /ping](/blog/health-check-khong-chi-la-ping). The other backend tech I use is in the [skills section on my homepage](/#skills).
