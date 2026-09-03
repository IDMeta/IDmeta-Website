# IDmeta Website — Huawei ECS deployment

This repository is a standalone Node.js website. It serves the static site and the contact endpoint at `POST /api/contact`; it does not use Cloudflare Workers or Wrangler. The contact endpoint sends mail through [Resend](https://resend.com) and verifies Cloudflare Turnstile tokens on the server.

This guide deploys the site on an Ubuntu/Debian Huawei Cloud ECS instance behind Nginx, then points a SiteGround-managed domain to the ECS public IP. Substitute the values below before running commands:

| Placeholder | Example |
| --- | --- |
| `YOUR_DOMAIN` | `idmetagroup.com` |
| `YOUR_ECS_PUBLIC_IPV4` | `203.0.113.10` |
| `APP_DIR` | `/opt/idmeta-website/current` |

## Before you start

- Give the ECS a fixed public IPv4 address (an Elastic IP is preferable). Changing the public IP later requires a DNS change.
- In the Huawei Cloud security group attached to the ECS, allow inbound TCP `22` only from trusted administrator IPs, and TCP `80` and `443` from `0.0.0.0/0`. If the ECS OS firewall is enabled, allow the same ports there too.
- Ensure `YOUR_DOMAIN` is using SiteGround nameservers if you intend to manage its DNS there. Otherwise, make the DNS changes at whichever provider hosts the authoritative DNS zone.
- Have the production `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, and correct `CONTACT_TO`/`CONTACT_FROM` values ready. Do not commit them. The sender domain must also be verified in Resend.

## 1. Connect and install server software

Connect with the Ubuntu/Debian administrator account provided for the ECS, then install Git, Nginx, and Node.js. This project requires Node.js 18 or newer.

```bash
ssh YOUR_USER@YOUR_ECS_PUBLIC_IPV4
sudo apt update
sudo apt install -y git nginx nodejs
node --version
```

If the displayed Node version is below 18, install a supported Node.js release using your operating system's or NodeSource's current Node.js package instructions, then re-run `node --version`.

## 2. Get the repository

For a first deployment, clone the repository. For a private repository, create an SSH deploy key on the ECS, add its public key in GitHub as a read-only deploy key, and use the SSH clone URL.

```bash
sudo mkdir -p /opt/idmeta-website
sudo git clone git@github.com:IDMeta/IDmeta-Website.git /opt/idmeta-website/current
sudo chown -R "$USER":"$USER" /opt/idmeta-website/current
cd /opt/idmeta-website/current
git status
```

If the repository is already on the ECS, update it instead:

```bash
git -C /opt/idmeta-website/current pull --ff-only
```

The application has no production package dependency to install. It needs only Node.js 18+ for the built-in `fetch` used by the contact endpoint.

## 3. Create the production environment file

Create the ignored `.env` file beside the application. Replace every placeholder with the real production value; never place the values in Git.

```bash
cd /opt/idmeta-website/current
cp .env.example .env
nano .env
sudo chown www-data:www-data .env
sudo chmod 600 .env
```

The file must include `PORT`, `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `CONTACT_TO`, and `CONTACT_FROM`. Keep `PORT=3000` unless you deliberately change both the application and Nginx configuration.

## 4. Install and start the service

The checked-in service file currently uses the local development `.env` path (`/Users/idmeta/Documents/GitHub/Website/.env`). Before installing it on the Linux ECS, set its `EnvironmentFile` to the ECS copy of `.env`:

```ini
EnvironmentFile=/opt/idmeta-website/current/.env
```

Copy the edited file to systemd, then enable and verify the service:

```bash
sudo cp deploy/idmeta-website.service /etc/systemd/system/idmeta-website.service
sudo nano /etc/systemd/system/idmeta-website.service
# Set EnvironmentFile=/opt/idmeta-website/current/.env, then save and exit.
sudo systemctl daemon-reload
sudo systemctl enable --now idmeta-website
sudo systemctl status idmeta-website --no-pager
curl -fsS http://127.0.0.1:3000/ > /dev/null && echo "Application is responding"
```

If it does not start, inspect the log:

```bash
sudo journalctl -u idmeta-website -n 100 --no-pager
```

## 5. Configure Nginx

Create the site configuration from the template, replacing both example hostnames with the real apex and `www` domain. Do not enable a configuration with `example.com` still present.

```bash
sudo cp deploy/nginx-idmeta-website.conf /etc/nginx/sites-available/idmeta-website
sudo nano /etc/nginx/sites-available/idmeta-website
sudo ln -s /etc/nginx/sites-available/idmeta-website /etc/nginx/sites-enabled/idmeta-website
sudo nginx -t
sudo systemctl reload nginx
```

Confirm the server responds through Nginx before changing DNS:

```bash
curl -I -H 'Host: YOUR_DOMAIN' http://127.0.0.1/
```

## 6. Point the SiteGround domain to the ECS

In SiteGround, open **Client Area → Services → Domains → Settings → DNS Zone Editor** for the domain. SiteGround permits DNS record management there only when the domain uses its nameservers. [SiteGround's DNS-record guide](https://www.siteground.com/kb/manage-dns-records) has the current navigation details.

Create or edit these records, replacing the example IP:

| Type | Name / Host | Target | TTL |
| --- | --- | --- | --- |
| A | `@` | `YOUR_ECS_PUBLIC_IPV4` | 1 hour |
| CNAME | `www` | `YOUR_DOMAIN` | 1 hour |

Remove or replace any conflicting `A`, `AAAA`, or `CNAME` record for `@`/`www`. Do not remove unrelated MX, TXT, DKIM, SPF, or verification records, as doing so can interrupt email. If the ECS does not have IPv6, remove an existing `AAAA` record for the website hostname; otherwise visitors may be sent to the wrong server over IPv6.

Wait for DNS to resolve to the ECS, then check it from the server or another machine:

```bash
dig +short A YOUR_DOMAIN
dig +short A www.YOUR_DOMAIN
```

Both names should ultimately resolve to `YOUR_ECS_PUBLIC_IPV4`. DNS caches can delay this despite a short TTL.

## 7. Enable HTTPS

Only after both domain names resolve to the ECS and ports 80/443 are reachable, request certificates:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN
sudo certbot renew --dry-run
```

Certbot updates the Nginx configuration and redirects HTTP to HTTPS when selected during its prompts. Confirm both `https://YOUR_DOMAIN` and `https://www.YOUR_DOMAIN` load, then submit a contact form and confirm that it reaches `CONTACT_TO`.

## Updating a live deployment from GitHub

On the ECS, pull only fast-forward updates, restart the app, test locally, and check the service status:

```bash
cd /opt/idmeta-website/current
git pull --ff-only
sudo systemctl restart idmeta-website
curl -fsS http://127.0.0.1:3000/ > /dev/null && echo "Application is responding"
sudo systemctl status idmeta-website --no-pager
```

If a release changes `deploy/idmeta-website.service` or `deploy/nginx-idmeta-website.conf`, review and re-copy the applicable configuration, run `sudo systemctl daemon-reload` for a systemd change, run `sudo nginx -t` for an Nginx change, and reload the affected service.

## Local run

For local testing, create a local `.env` from `.env.example`, set its values, then run:

```bash
set -a; source .env; set +a
npm start
```

Open `http://127.0.0.1:3000`.
