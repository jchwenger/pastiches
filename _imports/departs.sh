TITLE=departs
POST="../_posts/2021-12-10-$TITLE.md"

if [[ -f $POST ]]
then
  echo "found $POST, overwriting..."
  rm $POST
fi
touch $POST

s=$(cat "$TITLE".txt)

echo '---'                                                   >> $POST
echo 'layout: single'                                        >> $POST
echo 'title: "Départs"'                                      >> $POST
echo 'date: 2021-12-10 14:54:22.426607256 +0000'             >> $POST
echo 'permalink: /departs/'                                  >> $POST
echo 'unlisted: true'                                        >> $POST
echo 'pitch:'                                                >> $POST
echo '- "Protoype pour une pièce radiophonique à deux voix"' >> $POST
echo '---'                                                   >> $POST
echo ''                                                      >> $POST
echo "$s"                                                    >> $POST
echo ''                                                      >> $POST
