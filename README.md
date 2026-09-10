# Requirements

- `docker`
- `node 24.20.0`
- `npm 11.19.9`

# Launch project

```bash
cd src/client && npm install
```

```bash
cd src/server && npm install
```

```bash
docker compose up
````

Fiche de route

Faire un Tetris

Front : React + Tailwind
- Le client-side ne fait qu’afficher, sans logique métier
- Il demande au back les actions / états
- Pour jouer en solo, l’hôte de la partie voit un bouton "Lancer la partie"
- Quand l’hôte lance la partie, tous les joueurs de la room commencent à jouer

Back : Fastify + SQLite

Base de données :
- rt_user
    - id
    - name UNIQUE
    - hashed_password

- rt_scoring
    - id
    - user_id
    - score

Scoring :
- Historique global des scores
- À la fin de chaque partie, on ajoute une ligne
- Affichage du meilleur score au pire
- Pas besoin de date / d’historisation temporelle

Objets :

PLAYER
- id
- name

GAME
- id
- players[]
    - max 10 joueurs
    - players[0] = host
    - si le host quitte, le suivant devient automatiquement host
- waitingList[]
    - 20 joueurs ou plus
    - si la partie est en cours, les nouveaux arrivants vont en waiting room
    - ils regardent automatiquement la partie en cours
    - si la partie n’est pas lancée et qu’un player quitte :
        - waitingList[0] passe dans players[]
        - et ainsi de suite
- liste de pièces
- liste de boards
- refus du join si l’utilisateur est déjà dans players ou waitingList
- si plus aucun player, la partie peut être supprimée

BOARD
- player_id
- grille 20 lignes × 10 colonnes
- convention board[y][x]
    - y = ligne
    - x = colonne
- nombre de lignes indestructibles

PIECE
- tailles génériques
- liste de BLOCK

BLOCK
- position relative dans la pièce

Socket
- connection
- le back gère toute la partie
- à chaque événement, il émet le nouvel état via socket

Shared
- contrats communs front / back
- DTOs HTTP
- payloads / events Socket.IO
- types partagés du jeu

Débuts :

Back -> Kévin
- Familiarisation avec Fastify

Front -> Arthur
- Première esquisse React fonctionnelle
- Tailwind
- Première requête HTTP vers le back