all:
	git pull
	git add .
	git status
	git commit
	git push

update:
	git pull

pull:
	git pull

verify:
	npm run verify
