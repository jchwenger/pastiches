POST="../_posts/2021-04-09-alors-seulement-le-reve.md"
POEMS=true

if [[ -f $POST ]]
then
  echo "found $POST, overwriting..."
  rm $POST
fi
touch $POST

echo '---'                                       >> $POST
echo 'layout: single'                            >> $POST
echo 'classes: wide'                             >> $POST
echo 'title: "Alors seulement le rêve..."'       >> $POST
echo 'date: 2021-04-09 19:35:50.064492611 +0100' >> $POST
echo 'permalink: /alors-seulement-le-reve/'      >> $POST
echo 'pitch:'                                    >> $POST
echo '- "textes neuraux"'                        >> $POST
echo '---'                                       >> $POST
echo ''                                          >> $POST
s="> Texte issus de réécritures de matériaux obtenus à partir de modèles linguistiques neuraux français, utilisant l'architecture Transformer [GPT-2 d’OpenAI](https://openai.com/blog/better-language-models/)."
echo "$s"                                        >> $POST
echo ''                                          >> $POST

