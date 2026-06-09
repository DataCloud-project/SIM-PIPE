andrewrothstein.argo
=========

![Build Status](https://github.com/andrewrothstein/ansible-argo/actions/workflows/build.yml/badge.svg)

Installs the Argo Workflows [cli](https://github.com/argoproj/argo-workflows).

Requirements
------------

See [meta/main.yml](meta/main.yml)

Role Variables
--------------

See [defaults/main.yml](defaults/main.yml)

Dependencies
------------

See [meta/main.yml](meta/main.yml)

Example Playbook
----------------

```yml
- hosts: servers
  roles:
    - andrewrothstein.argo
```

License
-------

MIT

Author Information
------------------

Andrew Rothstein <andrew.rothstein@gmail.com>
