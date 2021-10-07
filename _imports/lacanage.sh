TITLE=lacanage
POST="../_posts/2021-09-06-$TITLE.md"
POEMS=false

if [[ -f $POST ]]
then
  echo "found $POST, overwriting..."
  rm $POST
fi
touch $POST

s=$(cat "$TITLE".txt)

echo '---'                                             >> $POST
echo 'layout: single'                                  >> $POST
echo 'classes: wide'                                   >> $POST
echo 'title: "Lacanage"'                               >> $POST
echo 'date: 2021-09-06 15:43:49.434726143 +0200'       >> $POST
echo 'permalink: /lacanage/'                           >> $POST
echo 'unlisted: true'                                  >> $POST
echo 'pitch:'                                          >> $POST
echo '- "Neural texts (with oneself & Jacques Lacan)"' >> $POST
echo '---'                                             >> $POST
echo ''                                                >> $POST
echo "$s"                                              >> $POST
echo ''                                                >> $POST
