#!/usr/bin/env python3
import json
from pathlib import Path

for name in ('n8n/workflow-funnel.json', 'automation/make-reengagement.json', 'public/manus-routes.json'):
    json.loads(Path(name).read_text())

data = json.loads(Path('n8n/workflow-funnel.json').read_text())
names = {node['name'] for node in data['nodes']}
targets = [
    edge['node']
    for groups in data['connections'].values()
    for group in groups['main']
    for edge in group
]
assert all(target in names for target in targets), 'n8n connection target missing'
assert data['deliveryPolicy'] == 'at-most-once'
print('automation JSON and n8n connection contract: pass')
