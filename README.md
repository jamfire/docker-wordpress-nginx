# Wordpress +MariaDB +Nginx Docker Stack

## Generate Local Certificates

Install [mkcert](https://github.com/FiloSottile/mkcert#installation) and then run the mkcert command in your certs directory. Update the environmental configuration for Nginx SSL as needed.

```
$ mkcert -install
Created a new local CA 💥
The local CA is now installed in the system trust store! ⚡️
The local CA is now installed in the Firefox trust store (requires browser restart)! 🦊

$ mkcert wordpress.local "*.wordpress.local"

Created a new certificate valid for the following names 📜
 - "wordpress.local"
 - "*.wordpress.local"

The certificate is at "./wordpress.local+1.pem" and the key at "./wordpress.local+1-key.pem" ✅
```