#!/bin/bash

if [[ $#  -ne 1 ]]
then
  echo "Please specify the submodule folder"
  exit 2
else
  if [[ ! -d  "$1" ]]
  then
    echo "'$1' is not a directory..."
    exit 2
  fi
  DIR="$1"
  echo "Updating '$DIR'."
fi

echo "Update imported submodule? "
read answer
echo "Your answer: $answer"
echo "----------------------------------------"
if [[ "${answer,,}" =~ y  ]]
then
  cd $DIR
  git pull
  cd ..
fi

source "$1.sh"

# https://stackoverflow.com/a/12298757
declare -a files
FILES=($DIR/[0-9]*.txt)
IND=$(( ${#FILES[*]} - 1 ))
LAST=${FILES[$IND]}

echo "poems? $POEMS"
echo ""
echo "texts:"
echo "------"

i=0
for f in "${FILES[@]}"; do
  ((i=i+1))
  echo "$i | $f"
  if [ "$POEMS" = true ]
  then
    echo "<poetry>"                                                         >> $POST
    if [ "$SEPARATORS" = true ]
    then
      cat "$f" \
        | sed -e "s/^\*\*$/{\% include separators.html type='star' \%}/" \
        | sed -e "s/^\*\*\*$/{\% include separators.html type='inner' \%}/" >> $POST
    else
      cat "$f"                                                              >> $POST
    fi
    echo "</poetry>"                                                        >> $POST
  else
    if [ "$SEPARATORS" = true ]
    then
      cat "$f" \
        | sed -e "s/^\*\*$/{\% include separators.html type='star' \%}/" \
        | sed -e "s/^\*\*\*$/{\% include separators.html type='inner' \%}/" >> $POST
    else
      cat "$f"                                                              >> $POST
    fi
  fi
  if [[ $f != $LAST ]]
  then
    echo ""                                                                 >> $POST
    if [ ! "$NO_OUTER_SEPARATORS" = true ]
    then
      echo "{% include separators.html type='outer' %}"                     >> $POST
    fi
    echo ""                                                                 >> $POST
  fi
done

sed -i 's/﻿//g' $POST

echo "----------------------------------------"
echo "Commit changes? "
read answer
echo "Your answer: $answer"
if [[ "${answer,,}" =~ y  ]]
then
  git add "$DIR"
  git add "$DIR.txt"
  git add "$POST"
  git add "$1.sh"
  git status
  echo "----------------------------------------"
  echo "Everything ok? "
  read second_answer
  if [[ "${second_answer,,}" =~ y  ]]
  then
    echo "Commit message?"
    read third_answer
    git commit -m "${1//-/ } | $third_answer"
    # git push
  else
    git restore --staged "$DIR"
    git restore --staged "$DIR.txt"
    git restore --staged "$POST"
    git restore --staged "$1.sh"
    echo "---------"
    echo "Aborting update."
    git status
    echo "----------------------------------------"
    exit 2
  fi
else
  echo "---------"
  echo "Aborting update."
  exit 2
fi
