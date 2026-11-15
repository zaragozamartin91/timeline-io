import * as domain from './domain.js';

const COMMENT_START = '#'
const STATEMENT_END = ';'



class RawInput {
    /** @type {string} */
    text;

    /**
     * @param {{text?: string}} params 
     */
    constructor({text = ''} = {}) {
        this.text = text;
    }

    /** @returns {Book} */
    splitLines() {
        const lines = this.text.split('\n').map(line => new Line({ text: line }));
        return new Book({ lines });
    }
}


class Line {
    /** @type {string} */
    text;

    /**
     * @param {{text?: string}} params 
     */
    constructor({text = ''} = {}) {
        this.text = text;
    }

    trim() {
        return new Line({ text: this.text.trim() });
    }

    isBlank() {
        return this.trim().text === '';
    }

    
}


/**
 * Group of consecutive lines that together form a single statement,
 * along with the parsed domain statement they produce.
 */
class Segment {
    /** @type {Line[]} */
    lines;

    /** @type {domain.Statement} */
    statement;

    /**
     * @param {{lines?: Line[], statement: domain.Statement}} params
     */
    constructor({lines = [], statement}) {
        this.lines = lines;
        this.statement = statement;
    }

    /**
     * Creates a Segment from the given lines and statement.
     *
     * @param {Line[]} lines Consecutive lines that form the statement
     * @param {domain.Statement} statement Parsed domain statement produced from the lines
     * @returns {Segment}
     * @throws {TypeError} If lines or statement is null or undefined
     */
    static of(lines, statement) {
        if (lines == null || statement == null) throw new TypeError('Segment.of requires non-null lines and statement');
        return new Segment({lines, statement});
    }
}


/** Collection of lines */
class Book {
    /** @type {Line[]} */
    lines;

    /**
     * @param {{lines?: Line[]}} params 
     */
    constructor({lines = []} = {}) {
        this.lines = lines;
    }

    /**
     * @param {number} index
     * @returns {Line}
     */
    getLine(index) {
        // validate index
        if (!Number.isInteger(index) || index < 0 || index >= this.size) throw new RangeError(`Line index out of bounds: ${index}`);
        return this.lines[index];
    }

    get size() {
        return this.lines.length;
    }
}

/**
 * Cursor over a Book that reads lines one at a time.
 * Keeps a bookmark with the index of the next line to be read,
 * and allows checking whether all the lines have been consumed.
 */
class BookWorm {
    /** @type {Book} */
    book;

    /** @type {number} */
    bookmark;

    /**
     * @param {{book: Book, lineIndex?: number}} params
     */
    constructor({book, lineIndex = 0}) {
        this.book = book;
        this.bookmark = lineIndex;
    }

    finished() {
        return this.bookmark >= this.book.size;
    }

    nextLine() {
        return this.book.getLine(this.bookmark++);
    }
}

/**
 * Segment parse result symbols. Each value is a unique symbol.
 * @enum {symbol}
 */
export const SegmentResult = Object.freeze({
    SUCCESS: Symbol('SUCCESS'),
    ERROR: Symbol('ERROR'),
    EMPTY: Symbol('EMPTY'),
});

/**
 * Outcome of parsing a segment: the result kind, plus the segment when one was produced.
 */
class SegmentOutcome {
    /** @type {symbol} */
    result;

    /** @type {Segment | undefined} */
    segment;

    /** @type {string | undefined} */
    errorType;

    /** @type {string | undefined} */
    errorMessage;

    /**
     * @param {{result: symbol, segment?: Segment, errorType?: string, errorMessage?: string}} params
     */
    constructor({result, segment, errorType, errorMessage}) {
        this.result = result;
        this.segment = segment;
        this.errorType = errorType;
        this.errorMessage = errorMessage;
    }

    /**
     * @param {Segment} segment
     * @returns {SegmentOutcome}
     */
    static success(segment) {
        if (segment == null) throw new TypeError('success outcome requires a non-null segment');
        return new SegmentOutcome({result: SegmentResult.SUCCESS, segment});
    }

    /**
     * @param {Line[]} lines
     * @param {domain.Statement} statement
     * @returns {SegmentOutcome}
     * @throws {TypeError} If lines or statement is null or undefined
     */
    static successLines(lines, statement) {
        return SegmentOutcome.success(Segment.of(lines, statement));
    }

    /**
     * @param {string} errorType
     * @param {string} errorMessage
     * @returns {SegmentOutcome}
     */
    static error(errorType, errorMessage) {
        return new SegmentOutcome({result: SegmentResult.ERROR, errorType, errorMessage});
    }

    /** @returns {SegmentOutcome} */
    static empty() {
        return new SegmentOutcome({result: SegmentResult.EMPTY});
    }
}

class Scribe {
    /** @type {BookWorm} */
    bookWorm;

    /**
     * @param {{bookWorm: BookWorm}} params
     */
    constructor({bookWorm}) {
        this.bookWorm = bookWorm;
    }

    finished() {
        return this.bookWorm.finished();
    }

    nextSegment() {
        if (this.finished()) return null;

        const line = this.bookWorm.nextLine();
        const lineAccum = [line];

        if (line.isBlank()) return SegmentOutcome.successLines(lineAccum, domain.Statement.EMPTY)
    }
}

