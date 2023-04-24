import argparse
import random
import signal
import subprocess
import sys
import threading
import time

services = [
    {"name": "cadvisor", "ports": [8081, 8080]},
    {"name": "grafana", "ports": [8082, 80]},
    {"name": "sftpgo", "ports": [8083, 80]},
    {"name": "argo", "ports": [8084, 2746], "fullname": "argo-workflows-server"},
    {"name": "minio", "ports": [8085, 9000]},
    {
        "name": "prometheus",
        "ports": [8086, 9090],
        "prefix": "",
        "fullname": "prometheus-operated",
    },
]


def port_forward(service, prefix, delay):
    prefix = service["prefix"] if "prefix" in service else prefix
    name = service["fullname"] if "fullname" in service else service["name"]

    while True:
        try:
            subprocess.run(
                [
                    "kubectl",
                    "port-forward",
                    f"service/{prefix}{name}",
                    f"{service['ports'][0]}:{service['ports'][1]}",
                    # Strong hate towards IPv6
                    # "--address=127.0.0.1",
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                # stderr=subprocess.DEVNULL,
            )
        except subprocess.CalledProcessError as e:
            print(f"Error port forwarding {service['name']}: {e}", file=sys.stderr)
            time.sleep(delay)
            delay = min(delay + random.uniform(0, 5), 10)
        else:
            break


def handle_exit(signal, frame):
    sys.exit(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Start kubernetes port forwardings")
    parser.add_argument(
        "--disable", type=str, nargs="*", help="list of services to disable"
    )
    parser.add_argument(
        "--prefix", type=str, default="simpipe-", help="prefix for service name"
    )
    args = parser.parse_args()

    disabled = args.disable if args.disable is not None else []
    prefix = args.prefix

    signal.signal(signal.SIGINT, handle_exit)
    signal.signal(signal.SIGTERM, handle_exit)

    threads = []
    for service in services:
        if service["name"] not in disabled:
            print(f"{service['name']}: http://localhost:{service['ports'][0]}")
            thread = threading.Thread(target=port_forward, args=(service, prefix, 1))
            thread.start()
            threads.append(thread)

    for thread in threads:
        thread.join()
