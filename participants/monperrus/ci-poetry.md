# Continuous Integration Poetry

## Intro

The is a poem made for the [continuous integration hackathon](https://github.com/KTH/ci-hackathon/) organized at KTH Royal Institute of Technology.
It is based on [travis-api/.travis.yml](https://github.com/travis-ci/travis-api/blob/ed6ffd5c306282e0c4e189cd9490efabc02a0795/.travis.yml) and is entitled `dot travis dot yml`.

--Martin Monperrus, october 2019

## Poem

code is poetry  
and the question is whether  
one can also find inspiration  
in continuous integration

let me read  
dot travis dot yml  
whose commit ed6ffd5  
starts with a vowel

code is language  
so is the spec

```yml
language: ruby

import:
  - travis-ci/build-configs/db-setup.yml
```

code is power  
sharp and big  
that's the meaning of a number

```yml
rvm: 2.5.1

script: "bundle exec rake knapsack:rspec"
env:
  global:
    - RUBY_GC_MALLOC_LIMIT=90000000
    - RUBY_GC_HEAP_FREE_SLOTS=200000
    - CI_NODE_TOTAL=3


matrix:
    - CI_NODE_INDEX=0
    - CI_NODE_INDEX=1
    - CI_NODE_INDEX=2
```

going to infinity  
repetition repetition  
is software for humanity?

yes

```yml
services:
  - redis-server
```

redis, read this,  
poetry is


```yml
before_install:
  - 'gem update --system'
```

poetry is rebooted  
it flies out of the repo  
and forever rooted  
it ripples for an eternal echo

```yml
jobs:
  include:
    - stage: ":ship: it to Quay.io"
      install: echo skip
      before_script: echo skip
      script: make ship
```

## See also

* [Code is poetry rap](https://amandagiles.com/blog/talks/code-is-poetry-rap/)
* [Data Murmur](https://vimeo.com/48294959)
