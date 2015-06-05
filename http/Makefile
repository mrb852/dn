PROJECT_NAME = ./get
SOURCES=./index.js
OBJECTS = get
WINOBJECTS =get.exe

ifeq ($(OS), Windows_NT)
	EXECUTABLE = $(PROJECT_NAME).exe
else
	EXECUTABLE = $(PROJECT_NAME)
endif

.PHONY: default clean all executable

default: all

clean:
ifeq ($(OS), Windows_NT)
@del $(WINOBJECTS)
else
	rm -f $(OBJECTS)
endif

$(EXECUTABLE): clean
	enclose --loglevel info -x -o $(EXECUTABLE) $(SOURCES)

all: $(EXECUTABLE)
