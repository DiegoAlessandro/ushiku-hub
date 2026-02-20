-- 薄いコンテンツの「牛久市役所」レコードを非公開化
-- content が 100文字未満で具体情報が乏しいものを対象
UPDATE stores
SET is_published = false
WHERE name = '牛久市役所'
  AND LENGTH(content) < 100
  AND is_published = true;

-- 影響行数確認用
-- SELECT id, name, content, is_published FROM stores WHERE name = '牛久市役所';
