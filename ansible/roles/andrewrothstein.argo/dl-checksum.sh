#!/usr/bin/env sh
set -e
DIR=~/Downloads
MIRROR=https://github.com/argoproj/argo-workflows/releases/download

# https://github.com/argoproj/argo-workflows/releases/download/v3.4.4/argo-linux-amd64.gz
# https://github.com/argoproj/argo-workflows/releases/download/v3.4.4/argo-workflows-cli-checksums.txt

dl()
{
    local lsums=$1
    local ver=$2
    local os=$3
    local arch=$4
    local suffix=${5:-gz}
    local platform="$os-$arch"

    local exe="argo-${platform}.${suffix}"
    local url="${MIRROR}/v${ver}/${exe}"
    printf "    # %s\n" $url
    printf "    %s: sha256:%s\n" $platform $(grep "${exe}" "${lsums}" | awk '{ print $1 }')
}

dlver () {
    local ver=$1
    local lsums="${DIR}/argo-workflows-${ver}-cli-checksums.txt"
    local rsums="${MIRROR}/v${ver}/argo-workflows-cli-checksums.txt"
    if [ ! -e "${csums}" ];
    then
        curl -sSLf -o "${lsums}" "${rsums}"
    fi
    printf "  # %s\n" $rsums
    printf "  '%s':\n" $ver
    dl $lsums $ver darwin amd64
    dl $lsums $ver darwin arm64
    dl $lsums $ver linux amd64
    dl $lsums $ver linux arm64
    dl $lsums $ver linux ppc64le
    dl $lsums $ver linux s390x
    dl $lsums $ver windows amd64 exe.gz
}

dlver ${1:-3.4.9}
