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
DIR="$1"
declare -a files
FILES=($DIR/[0-9]*.txt)
IND=$(( ${#FILES[*]} - 1 ))
LAST=${FILES[$IND]}

i=0
for f in "${FILES[@]}"; do
  ((i=i+1))
  echo "$i | $f"
  if [ $POEMS ]
  then
    echo "<poetry>"                                   >> $POST
    cat "$f"                                          >> $POST
    echo "</poetry>"                                  >> $POST
  else
    cat "$f"                                          >> $POST
  fi
  if [[ $f != $LAST ]]
  then
    echo ""                                           >> $POST
    echo "{% include separators.html type='outer' %}" >> $POST
    echo ""                                           >> $POST
  fi
done

# add two spaces at the end of § lines for markdown
vim $POST \
  -c "%s/\(.\)\n\(\n\)\@!/\1  \r/eg" \
  -c "%s/﻿//g" \
  -c "wq"

echo "----------------------------------------"
echo "Commit changes? "
read answer
echo "Your answer: $answer"
if [[ "${answer,,}" =~ y  ]]
then
  git add "$DIR"
  git add "$POST"
  git add "$1.sh"
  git status
  echo "----------------------------------------"
  echo "Everything ok? "
  read second_answer
  if [[ "${second_answer,,}" =~ y  ]]
  then
    git commit -m "${1//-/ } | update submodule, source files, bash script and post"
    # git push
  else
    git restore --staged "$DIR"
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
