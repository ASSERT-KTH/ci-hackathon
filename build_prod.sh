python3 site_generator/generate.py https://kth.github.io/ci-hackathon

bundle exec jekyll build --config _config_build.yml

git push origin --delete gh-pages
touch build/_config.yml
git add build && git commit -m "WIP"
git subtree push  --prefix build origin gh-pages