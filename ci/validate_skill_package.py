#!/usr/bin/env python3
import hashlib
import zipfile
from pathlib import Path

package = Path('ci/skills/production-funnel-automation.skill')
expected = Path('ci/skills/production-funnel-automation.skill.sha256').read_text().split()[0]
actual = hashlib.sha256(package.read_bytes()).hexdigest()
assert actual == expected, f'checksum mismatch: {actual} != {expected}'
with zipfile.ZipFile(package) as archive:
    bad = archive.testzip()
    assert bad is None, f'corrupt archive member: {bad}'
    required = {
        'SKILL.md',
        'references/automation-contract.md',
        'scripts/validate_exports.py',
        'templates/reconciliation.sql',
    }
    assert required.issubset(set(archive.namelist())), 'required skill files missing'
    archive.extractall('/tmp/production-funnel-automation')
print('skill package: checksum, archive, and file manifest pass')
