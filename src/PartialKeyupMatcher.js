class PartialKeyupMatcher {
	constructor() {
		this._pendingMatches = new Set();
	}

	addPendingMatch(keyBinding) {
		this._pendingMatches.add(keyBinding);
		keyBinding['nextKeyUpIndex'] = 0;
	}

	getMatches(userKeyupKeystroke) {
		userKeyupKeystroke = this._normalizeKeystroke(userKeyupKeystroke);

		let matches = new Set();

		// Loop over each pending keyup match.
		for (const keyBinding of this._pendingMatches) {
			const bindingKeystrokeToMatch = this._normalizeKeystroke(
				keyBinding.getKeyups()[keyBinding['nextKeyUpIndex']]
			)
			if (userKeyupKeystroke === bindingKeystrokeToMatch) {
				this._updateStateForMatch(matches, keyBinding)
			}
		}

		return [...matches];
	}

	_normalizeKeystroke (keystroke) {
		if (keystroke[0] === '^') {
			return keystroke.substring(1)
		}

		return keystroke;
	}

	_updateStateForMatch (matches, keyBinding) {
		if (keyBinding['nextKeyUpIndex'] === keyBinding.getKeyups().length - 1) {
			this._pendingMatches.delete(keyBinding);
			matches.add(keyBinding);
		} else {
			keyBinding['nextKeyUpIndex']++;
		}
	}
}

export default PartialKeyupMatcher;
