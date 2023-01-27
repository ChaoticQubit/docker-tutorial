DOCK_FILE=docker-compose.yml
DEV_FILE=docker-compose.dev.yml
PROD_FILE=docker-compose.prod.yml

BUILD="--build"
UP="up"
DOWN="down"
COMMAND="docker-compose -f docker-compose.yml -f "

# Check if arguments are supplied
flags=$1
if [ ${#flags} -eq 0 ]
  then
    echo "Error: No arguments supplied. Select from [-d: Dev, -p: Prod, -u: Up, -w: Down, -b: Build]"
    exit 1
elif [ ${#flags} -lt 3 ]
  then
    echo "Error: Arguments missing. Atleast 2 arguments required!"
    exit 1
else
  if [[ $flags != *d* ]] && [[ $flags != *p* ]]; then
    echo "Error: Environment not specified. Select from [-d: Dev, -p: Prod]"
    exit 1
  elif [[ $flags != *u* ]] && [[ $flags != *w* ]]; then
    echo "Error: Action not specified. Select from [-u: Up, -w: Down]"
    exit 1
  fi
fi

# Check if files exist
if [ ! -f "$DOCK_FILE" ]
  then
    echo "docker-compose.yml not found"
    exit 1
fi

if [ ! -f "$DEV_FILE" ]
  then
    echo "docker-compose.dev.yml not found"
    exit 1
fi

if [ ! -f "$PROD_FILE" ]
  then
    echo "docker-compose.prod.yml not found"
    exit 1
fi

# Function to run dev environment
dev() {
  echo "Using development environment -----------------"
  COMMAND=$COMMAND$DEV_FILE
}

# Function to run prod environment
prod() {
  echo "Using production environment -----------------"
  COMMAND=$COMMAND$PROD_FILE
}

# Function to bring up containers
up() {
  echo "Bringing up containers"
  COMMAND=$COMMAND" "$UP" -d"
}

# Function to bring down containers
down() {
  echo "Bringing down containers"
  COMMAND=$COMMAND" "$DOWN""
}

# Function to build images
build() {
  echo "Building Images"
  COMMAND=$COMMAND" "$BUILD
}

# Function to check if argument is valid
checkFlag(){
  if [[ $1 == *$2* ]]; then
    echo $3
    exit 1
  else
    $4
  fi
}

while getopts 'dpuwb' OPTIONS; do
  case $OPTIONS in
    d) checkFlag $1 p "Error: Cannot use both -d and -p" dev;;
    p) checkFlag $1 d "Error: Cannot use both -p and -d" prod;;
    u) checkFlag $1 w "Error: Cannot use both -u and -w" up;;
    w) checkFlag $1 u "Error: Cannot use both -w and -u" down;;
    b) checkFlag $1 w "Error: Cannot build while bringing down containers!!!" build;;
    *) echo "Invalid Flag! Select from [-d: Dev, -p: Prod, -u: Up, -w: Down, -b: Build]";;
  esac
done

# Add extra arguments to command
for i in "${@:3}"
do
  COMMAND=$COMMAND" "$i
done

# Run command
eval $COMMAND
echo "Done."