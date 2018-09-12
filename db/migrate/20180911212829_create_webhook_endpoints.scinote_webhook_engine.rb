# This migration comes from scinote_webhook_engine (originally 20180911205801)
class CreateWebhookEndpoints < ActiveRecord::Migration[5.1]
  def change
    create_table :webhook_endpoints do |t|
      t.string :target_url, null: false
      t.string :events, null: false, array: true
      t.timestamps
      t.index :events
    end
  end
end
