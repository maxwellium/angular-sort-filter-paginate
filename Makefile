JADE = $(shell find . -wholename '*.jade' -type f)
HTML = $(JADE:.jade=.html)

all: $(HTML)

%.html: %.jade
	jade $<

clean:
	rm -f $(HTML)

.PHONY: clean
