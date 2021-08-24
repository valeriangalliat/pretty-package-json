keys.json:
	curl -sL 'https://docs.npmjs.com/cli/v7/configuring-npm/package-json' \
		| sed 's,<h3,\n<h3,g;s,</h3>,</h3>\n,g' \
		| grep -o '<h3.*<\/h3>' \
		| sed -n 's,.*>\([^<]*\)</h3>,\1,p' \
		| grep -v '^[A-Z]' \
		| sed 's/.*: //; s/, /\n/' \
		| jq -Rs 'split("\n") | map(select(. != ""))' \
		> $@
