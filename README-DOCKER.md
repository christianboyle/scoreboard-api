# Docker Setup for Scoreboard API

This guide explains how to run the Scoreboard API using Docker, making it a perfect drop-in replacement for the paid `scores.weaklytyped.com` service.

## Quick Start

### Production Deployment (Default)

1. **Build and Start the Container**
   ```bash
   docker-compose up --build -d
   ```

2. **Test the API**
   ```bash
   curl http://localhost:7777/api/v1/sports/mlb/events
   ```

3. **Stop the Container**
   ```bash
   docker-compose down
   ```

### Development Mode

For local development with port 4000:

```bash
docker-compose -f docker-compose.dev.yml up --build -d
```

### Using the Startup Script

Make the script executable and run it:

```bash
# Production mode (port 80)
chmod +x scripts/docker-start.sh
./scripts/docker-start.sh

# Development mode (port 4000)
./scripts/docker-start.sh dev
```

## File Structure

- `docker-compose.yml` - **Production configuration** (port 7777, resource limits)
- `docker-compose.dev.yml` - **Development configuration** (port 4000, no limits)
- `Dockerfile` - Application container definition
- `scripts/docker-start.sh` - Helper startup script

## API Endpoints

Once running, your API will be available at:

### Production (Port 7777)
| Endpoint | Description |
|----------|-------------|
| `http://localhost:7777/api/v1/sports/mlb/events` | MLB game scores |
| `http://localhost:7777/api/v1/sports/nfl/events` | NFL game scores |
| `http://localhost:7777/api/v1/sports/nba/events` | NBA game scores |
| `http://localhost:7777/api/v1/sports/ncaam/events` | NCAA Men's Basketball |
| `http://localhost:7777/api/v1/sports/ncaaf/events` | NCAA Football |
| `http://localhost:7777/api/v1/sports/nhl/events` | NHL game scores |

### Development (Port 4000)
| Endpoint | Description |
|----------|-------------|
| `http://localhost:4000/api/v1/sports/mlb/events` | MLB game scores |
| `http://localhost:4000/api/v1/sports/nfl/events` | NFL game scores |
| `http://localhost:4000/api/v1/sports/nba/events` | NBA game scores |
| etc. | (same endpoints, different port) |

### Stats Endpoints

Replace `/events` with `/stats` to get player statistics:
- Production: `http://localhost:7777/api/v1/sports/mlb/stats`
- Development: `http://localhost:4000/api/v1/sports/mlb/stats`

## Replacing the Old Service

If you have code that calls the old paid service:

**Before:**
```javascript
const response = await fetch('https://scores.weaklytyped.com/api/v1/sports/mlb/events');
```

**After (development):**
```javascript
const response = await fetch('http://localhost:4000/api/v1/sports/mlb/events');
```

**After (production deployment):**
```javascript
const response = await fetch('http://localhost:7777/api/v1/sports/mlb/events');
// or
const response = await fetch('http://your-server.com:7777/api/v1/sports/mlb/events');
```

## Docker Commands Reference

### Basic Operations

**Production (default):**
```bash
# Build the image
docker-compose build

# Start the service
docker-compose up -d

# View logs
docker logs scoreboard-api-scoreboard-api-1

# Stop the service
docker-compose down

# Rebuild and restart
docker-compose up --build -d
```

**Development:**
```bash
# Start development mode
docker-compose -f docker-compose.dev.yml up -d

# Stop development mode
docker-compose -f docker-compose.dev.yml down
```

### Monitoring
```bash
# Check container status
docker-compose ps

# Follow logs in real-time
docker-compose logs -f

# View resource usage
docker stats scoreboard-api-scoreboard-api-1
```

## Environment Variables

You can customize the deployment by setting these environment variables:

- `NODE_ENV`: Set to `production` for production deployment (default: `production`)
- `PORT`: Internal container port (default: `4000`)

Example with custom environment:
```bash
docker-compose up --build -d -e NODE_ENV=production -e PORT=4000
```

## Troubleshooting

### Container Keeps Restarting
Check the logs:
```bash
docker logs scoreboard-api-scoreboard-api-1
```

### Port Already in Use
If port 4000 is already in use, edit `docker-compose.yml` and change:
```yaml
ports:
  - "4001:4000"  # Use port 4001 instead
```

### Health Checks
The container includes health checks that test every 30 seconds. Check health status:
```bash
docker-compose ps
```

### Memory Issues
The production compose file sets memory limits. If you need more memory:
```yaml
deploy:
  resources:
    limits:
      memory: 1G  # Increase from 512M
```

## Performance Notes

- The API updates scores every 30 seconds by scraping ESPN
- First request to each sport might be slower while data loads
- Container uses approximately 256MB RAM under normal load
- Handles multiple concurrent requests efficiently

## Network Access

If deploying on a server and accessing from other machines, ensure:

1. **Firewall**: Port 4000 (or 80 for production) is open
2. **Docker binding**: The compose file binds to all interfaces (`0.0.0.0:4000:4000`)
3. **Server configuration**: No additional proxy needed, the API serves directly

## Security Considerations

- The Docker container runs as a non-root user (`nextjs:nodejs`)
- No sensitive data is stored in the container
- All data is fetched from public ESPN endpoints
- Consider using a reverse proxy (nginx) for production SSL/TLS

## Integration Examples

### React/Next.js
```javascript
// hooks/useScoreboard.js
export const useScoreboard = (sport) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchScores = async () => {
      const response = await fetch(`http://localhost:4000/api/v1/sports/${sport}/events`);
      const scores = await response.json();
      setData(scores);
    };
    
    fetchScores();
    const interval = setInterval(fetchScores, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [sport]);
  
  return data;
};
```

### Python
```python
import requests
import time

def get_scores(sport='mlb'):
    response = requests.get(f'http://localhost:4000/api/v1/sports/{sport}/events')
    return response.json()

# Get scores every 30 seconds
while True:
    scores = get_scores('mlb')
    print(f"Found {len(scores['scores'])} games")
    time.sleep(30)
```

## Support

This is a community fork of the original scoreboard-api. For issues:

1. Check the container logs first
2. Verify ESPN is accessible from your network
3. Test with a simple curl request
4. Check Docker and Docker Compose versions

**Minimum Requirements:**
- Docker 20.0+
- Docker Compose 2.0+
- 512MB RAM
- Network access to ESPN.com