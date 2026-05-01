'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Plus, Loader2 } from 'lucide-react'
import type { Game } from '@/lib/types'
import { addGame, toggleGameActive } from '@/lib/storage'

interface GameManagerProps {
  games: Game[]
  onUpdate: () => void
}

export function GameManager({ games, onUpdate }: GameManagerProps) {
  const [newGameId, setNewGameId] = useState('')
  const [newGameName, setNewGameName] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleAdd = async () => {
    if (!newGameId.trim() || !newGameName.trim() || isAdding) return
    setIsAdding(true)
    const success = await addGame(newGameId.trim(), newGameName.trim())
    if (success) {
      setNewGameId('')
      setNewGameName('')
      onUpdate()
    }
    setIsAdding(false)
  }

  const handleToggle = async (gameId: string, currentActive: boolean) => {
    setLoadingId(gameId)
    await toggleGameActive(gameId, !currentActive)
    onUpdate()
    setLoadingId(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="游戏ID (如: zzz)"
          value={newGameId}
          onChange={(e) => setNewGameId(e.target.value)}
          className="flex-1 h-9 text-sm bg-secondary border-0"
        />
        <Input
          placeholder="游戏名称 (如: 绝区零)"
          value={newGameName}
          onChange={(e) => setNewGameName(e.target.value)}
          className="flex-1 h-9 text-sm bg-secondary border-0"
        />
        <Button
          size="sm"
          onClick={handleAdd}
          disabled={!newGameId.trim() || !newGameName.trim() || isAdding}
          className="h-9 px-3"
        >
          {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </Button>
      </div>

      <div className="space-y-1">
        {games.map((game) => (
          <div
            key={game.game_id}
            className="flex items-center justify-between py-2 px-3 rounded-md bg-secondary/50"
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm ${!game.is_active ? 'text-muted-foreground line-through' : ''}`}>
                {game.name}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                {game.game_id}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {loadingId === game.game_id ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Switch
                  checked={game.is_active}
                  onCheckedChange={() => handleToggle(game.game_id, game.is_active)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
