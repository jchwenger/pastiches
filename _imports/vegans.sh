TITLE=vegans
POST="../_posts/2021-10-27-$TITLE.md"
SEPARATORS=true

if [[ -f $POST ]]
then
  echo "found $POST, overwriting..."
  rm $POST
fi
touch $POST

s=$(cat "$TITLE".txt)

echo '---'                                        >> $POST
echo 'layout: single'                             >> $POST
echo 'classes: wide'                              >> $POST
echo 'title: "Vegans"'                            >> $POST
echo 'date: 2021-10-27 13:20:34.525753107 +0100'  >> $POST
echo 'permalink: /vegans/'                        >> $POST
echo 'unlisted: true'                             >> $POST
echo 'pitch:'                                     >> $POST
echo '- "Neural variations from a single prompt"' >> $POST
echo '---'                                        >> $POST
echo ''                                           >> $POST
echo "$s"                                         >> $POST
echo ''                                           >> $POST
