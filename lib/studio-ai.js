export function aiTextForField(platformId, fieldKey, current = '', notes = '') {
  const base = current.trim() || 'Premium product crafted for everyday use.';
  const direction = notes.trim() ? ` ${notes.trim()}` : '';
  const snippets = {
    caption: `${base} ✨ Discover quality you can feel — shop now.${direction}`,
    primaryText: `${base} Limited availability. Tap to explore.${direction}`,
    postText: `${base}\n\nBuilt for customers who value craftsmanship.${direction ? `\n\n${direction}` : ''}`,
    headline: (base.split('.')[0].slice(0, 55) || 'Crafted For Everyday Excellence') + (direction ? ' — AI Refresh' : ''),
    title: `${base.split('.')[0]} — Now Available`,
    description: `${base} Designed to convert with clear value and urgency.${direction}`,
  };
  return snippets[fieldKey] || `${base} Optimized for ${platformId}.${direction}`;
}

export function buildAiPatch(post, fields, actionId = 'all', notes = '') {
  const patch = {};
  if (actionId === 'all' || actionId === 'optimize') {
    fields.forEach((field) => {
      if (field.type === 'textarea' || field.type === 'text') {
        patch[field.key] = aiTextForField(post.id, field.key, post[field.key], notes);
      }
    });
  } else if (actionId === 'caption') {
    const copyField = fields.find((f) =>
      ['caption', 'primaryText', 'postText', 'description'].includes(f.key)
    );
    if (copyField) patch[copyField.key] = aiTextForField(post.id, copyField.key, post[copyField.key], notes);
  } else if (actionId === 'headline') {
    const headlineField = fields.find((f) => ['headline', 'title'].includes(f.key));
    if (headlineField) patch[headlineField.key] = aiTextForField(post.id, headlineField.key, post[headlineField.key], notes);
  }
  return patch;
}

export function applyAiRegeneration(post, fields, notes = '') {
  return {
    ...post,
    ...buildAiPatch(post, fields, 'all', notes),
    aiVersion: (post.aiVersion || 0) + 1,
    status: 'ready',
  };
}
