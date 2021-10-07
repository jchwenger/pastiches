POST="../_posts/2021-09-06-lacanage.md"
POEMS=false

if [[ -f $POST ]]
then
  echo "found $POST, overwriting..."
  rm $POST
fi
touch $POST

s="> Texts produced from materials obtained using Transformer [OpenAI's"
s="$s GPT-2](https://openai.com/blog/better-language-models/) language models"
s="$s trained on works by French psychoanalyst Jacques Lacan and my own texts."
s="$s This is work is one half of a collaboration with Alan Cunningham, who"
s="$s entitled his mixture (his own texts and the same corpus by Lacan)"
s="$s 'A Lacking Text'. We are very grateful for the support of the [Art's"
s="$s Council of Northern Ireland](http://www.artscouncil-ni.org/) in 2020. "
# s="$s Those proceedings have been jointly submitted to "
# s="$s [New Critique](https://newcritique.co.uk/) in August 2021."

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
