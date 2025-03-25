all:
	git add .
	git status
	git commit
	git push

cp:
	cp -r ~/travel-guide/* ~/htdocs
