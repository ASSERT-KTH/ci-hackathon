Parcor
======
Parcor is an interactive parallel coordinate plot. It takes a stream of integers as input as a list of axes.

Parcor is a useful visualization of realtime data to quickly diagnose what is happening.

To make it run:

```bash
$ git clone git@github.com:kubernetes/kubernetes.git
$ cd kubernetes
$ git log --pretty=format:'{ "commit": "%H", "abbreviated_commit": "%h", "tree": "%T", "abbreviated_tree": "%t", "parent": "%P", "abbreviated_parent": "%p", "refs": "%D", "encoding": "%e", "subject": "%s", "sanitized_subject_line": "%f", "commit_notes": "%N", "verification_flag": "%G?", "signer": "%GS", "signer_key": "%GK", "author_name": "%aN", "author_email": "%aE", "author_date": "%aD", "commiter_name": "%cN", "committer_email": "%cE", "committer_date": "%cD"}'  | pv -qL 4000 | python3 ../ci-hackathon/participants/parcor/convert2.py | ../ci-hackathon/participants/parcor/main ../ci-hackathon/participants/parcor/index.html
```
