#!/bin/sh -e

[ -z "${DEBUG}" ] || set -x

# Pfad zu überprüfen
CHECK_FILE="/var/www/.abba/uninstall" # Ersetze dies mit dem tatsächlichen Pfad zur Datei

# Überprüfe, ob die Datei vorhanden ist
if [ ! -f "$CHECK_FILE" ]; then
    # Download the installer
    curl -sL ${BASE_URL:-https://reddexx.github.io/abba}/install -o /tmp/install

    # And run it in the workdir
    /bin/sh -e ${DEBUG:+-x} /tmp/install ${THEME}
else
    echo "Installer wurde nicht ausgeführt, da $CHECK_FILE vorhanden ist."
fi

# Uninstall on exit
trap "" EXIT

# Execute the command in background to be able to call the uninstall script
# Using SIGWINCH as it is used by httpd for graceful exit
exec "$@" &
trap "kill $!" TERM
trap "kill -WINCH $!" WINCH
wait
