I ran some basic perf spot checks and it seems that `jsan` shines when stringifying
small objects and arrays, and with large objects with no circular references. It does
poorly compared to `CircularJSON` when stringifying the global object and ties
the rest of the time.
