#!/bin/bash
multipass launch docker -n docker-wordpress
multipass mount . docker-wordpress:/home/ubuntu/wordpress