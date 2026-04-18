# Kvízomat — Automatické spuštění

## Jednorázové nastavení (spustit jen jednou):

```bash
chmod +x start.sh
cp com.kvizomat.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.kvizomat.plist
```

## Manuální spuštění:

```bash
./start.sh
```

## Zastavení:

```bash
launchctl unload ~/Library/LaunchAgents/com.kvizomat.plist
```

## Logy:

```bash
tail -f /tmp/kvizomat.log
tail -f /tmp/kvizomat-error.log
```
