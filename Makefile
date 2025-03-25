all:
	git add .
	git status
	git commit
	git push

cp:
	git pull
	cp -r ~/travel-guide/* ~/htdocs
