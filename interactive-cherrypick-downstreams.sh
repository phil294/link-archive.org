#!/bin/bash
set -e

# should be d-1 because the very first commit might be omitted otherwise (?)
since="$1"
[ -z "$since" ] && echo 'arg1 = date in format YYYY-MM-DD' && exit 5

pause() {
    read -r -n 1 -s -u 3 -p 'Press any key to continue. . .'
}

git fetch --all

hashes=$(git log --since="$since" --grep='\[up\]' --branches='*' --remotes='*' --reverse --no-notes --pretty='format:%H')
while read -r hash; do
    echo $hash
    git show -s --format=medium $hash
    git branch -a --contains $hash
    # todo remove the [up] part so that they dont find their way back in to this repository recursively (?) probably not really an issue due to the "since" date
    git cherry-pick --no-commit -x "$hash" ||:
    pause
    sleep 0.5
    echo
    commit_ret=0
    git commit --no-edit || commit_ret=$?
    if [[ $commit_ret != 0 ]]; then
        if [[ $commit_ret == 1 ]]; then
            : 'nothing to commit'
        elif [[ $commit_ret == 128 ]]; then
            pause # failed
        else
            exit $commit_ret
        fi
    fi
done 3<&0 <<<"$hashes"