#!/bin/bash
set -e

# should be d-1 because the very first commit might be omitted otherwise (?)
since="2020-07-23"

git fetch --all

hashes=$(git log --since="$since" --grep='\[up\]' --branches='*' --remotes='*' --reverse --no-notes --pretty='format:%H')
while read -r hash; do
    echo $hash
    # todo remove the [up] part so that they dont find their way back in to this repository recursively (?) probably not really an issue due to the "since" date
    git cherry-pick --no-commit -x "$hash" ||:
    read -r -n 1 -s -u 3 -p 'Press any key to continue. . .'
    sleep 0.5
    echo
done 3<&0 <<<"$hashes"