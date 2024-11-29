#!/bin/sh -e

[ -z "${DEBUG}" ] || set -x

# Uninstall on exit
trap "" EXIT

# Execute the command in background to be able to call the uninstall script
# Using SIGWINCH as it is used by httpd for graceful exit
exec "$@" &
trap "kill $!" TERM
trap "kill -WINCH $!" WINCH
wait
